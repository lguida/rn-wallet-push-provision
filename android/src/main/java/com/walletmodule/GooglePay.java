package com.walletmodule;

import android.app.Activity;
import android.provider.Settings.Secure;
import androidx.fragment.app.Fragment;
import androidx.annotation.NonNull;
import com.google.android.gms.tapandpay.TapAndPay;
import com.google.android.gms.tapandpay.TapAndPayClient;
import com.google.android.gms.tapandpay.TapAndPayStatusCodes;
import com.google.android.gms.tapandpay.issuer.IsTokenizedRequest;
import com.google.android.gms.tapandpay.issuer.PushTokenizeRequest;
import com.google.android.gms.tapandpay.issuer.UserAddress;
import com.google.android.gms.tapandpay.issuer.TokenInfo;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.android.gms.common.api.ApiException;
import com.facebook.react.bridge.Promise;

import android.util.Log;
//import java.util.List;

public class GooglePay {
    private TapAndPayClient tapAndPayClient;
    private String clientCustomerId;
    private Activity currentActivity;

    public static final int REQUEST_CODE_PUSH_TOKENIZE = 3;
    public static final int REQUEST_CREATE_WALLET = 4;

    public GooglePay(Activity activity) {
        tapAndPayClient = TapAndPay.getClient(activity);
        clientCustomerId = null;
        currentActivity = activity;
    }

    private class CardNetworkInfo {
        int cardNetwork;
        int tokenProvider;
    }

    private CardNetworkInfo getCardNetwork(String cardNetworkName) {
        CardNetworkInfo cardNetworkInfo = new CardNetworkInfo();
        switch (cardNetworkName) {
            case "MASTERCARD":
                cardNetworkInfo.cardNetwork = TapAndPay.CARD_NETWORK_MASTERCARD;
                cardNetworkInfo.tokenProvider = TapAndPay.TOKEN_PROVIDER_MASTERCARD;
                break;
            case "VISA":
                cardNetworkInfo.cardNetwork = TapAndPay.CARD_NETWORK_VISA;
                cardNetworkInfo.tokenProvider = TapAndPay.TOKEN_PROVIDER_VISA;
                break;
            default:
                break;
        }
        return cardNetworkInfo;
    }

    public void checkIfAlreadyAdded(String cardLast4, String cardNetwork, Promise reactPromise) {
         CardNetworkInfo cardNetworkInfo = this.getCardNetwork(cardNetwork);
        
        IsTokenizedRequest request = new IsTokenizedRequest.Builder()
            .setIdentifier(cardLast4)
            .setNetwork(cardNetworkInfo.cardNetwork)
            .setTokenServiceProvider(cardNetworkInfo.tokenProvider)
            .build();
        tapAndPayClient
            .isTokenized(request)
            .addOnCompleteListener(
                new OnCompleteListener<Boolean>() {
                    @Override
                    public void onComplete(@NonNull Task<Boolean> task) {
                        if (task.isSuccessful()) {
                            Boolean result = task.getResult();
                            reactPromise.resolve(result);
                            Log.d("GooglePay.checkIfAlreadyAdded", result.toString());
                        } else {
                            ApiException apiException = (ApiException) task.getException();
                            int exceptionCode = apiException.getStatusCode();
                            String handledExceptionCode = handleTokenizationResult(exceptionCode);
                            Log.d("GooglePay.checkIfAlreadyAdded", handledExceptionCode);
                            reactPromise.reject(handledExceptionCode);
                        }
                    }
                });
    }

    private void createNewWallet(){//Promise reactPromise) {
        tapAndPayClient
            .createWallet(currentActivity, REQUEST_CREATE_WALLET);
    }

    public void getWalletId(Promise reactPromise){
        tapAndPayClient
            .getActiveWalletId()
            .addOnCompleteListener(
                new OnCompleteListener<String>() {
                @Override
                public void onComplete(@NonNull Task<String> task) {
                    if (task.isSuccessful()) {
                    String walletId = task.getResult();
                    reactPromise.resolve(walletId);
                    } else {
                    ApiException apiException = (ApiException) task.getException();
                    //might not need any of this
                    if (apiException.getStatusCode() == TapAndPayStatusCodes.TAP_AND_PAY_NO_ACTIVE_WALLET) {
                        // There is no wallet. A wallet will be created when tokenize()
                        // or pushTokenize() is called.
                        // If necessary, you can call createWallet() to create a wallet
                        // eagerly before constructing an OPC (Opaque Payment Card)
                        // to pass into pushTokenize()
                        createNewWallet();//reactPromise);
                        reactPromise.resolve(""); //hmm what to do here... create wallet will open a new flow
                    }
                    String error = handleTokenizationResult(apiException.getStatusCode());
                    Log.d("GooglePay.getWalletId", error);
                    reactPromise.reject(error);
                    }
                }
            });
    }

    public void handleAddToGooglePayClick(
        String opaquePaymentCard,
        String cardHolderName,
        String addressline1,
        String city,
        String state,
        String country,
        String postalcode,
        String mobileNumb,
        String cardLabel,
        String cardLast4,
        String cardNetwork) {

        byte[] opcBytes = opaquePaymentCard.getBytes();

        UserAddress userAddress = UserAddress.newBuilder()
                .setName(cardHolderName)
                .setAddress1(addressline1)
                .setLocality(city)
                .setAdministrativeArea(state)
                .setCountryCode(country)
                .setPostalCode(postalcode)
                .setPhoneNumber(mobileNumb)
                .build();
        
        CardNetworkInfo cardNetworkInfo = this.getCardNetwork(cardNetwork);

        PushTokenizeRequest pushTokenizeRequest = new PushTokenizeRequest.Builder()
                .setOpaquePaymentCard(opcBytes)
                .setNetwork(cardNetworkInfo.cardNetwork)
                .setTokenServiceProvider(cardNetworkInfo.tokenProvider)
                .setDisplayName(cardLabel)
                .setLastDigits(cardLast4)
                .setUserAddress(userAddress)
                .build();

        tapAndPayClient.pushTokenize(currentActivity, pushTokenizeRequest, REQUEST_CODE_PUSH_TOKENIZE);
    }

    private String handleTokenizationResult(int resultCode) {
        switch (resultCode) {
            case TapAndPayStatusCodes.TAP_AND_PAY_NO_ACTIVE_WALLET:
                return "TAP_AND_PAY_NO_ACTIVE_WALLET - 15002";
            case TapAndPayStatusCodes.TAP_AND_PAY_TOKEN_NOT_FOUND:
                return  "TAP_AND_PAY_TOKEN_NOT_FOUND - 15003";
            case TapAndPayStatusCodes.TAP_AND_PAY_INVALID_TOKEN_STATE:
                return "TAP_AND_PAY_INVALID_TOKEN_STATE - 15004";
            case TapAndPayStatusCodes.TAP_AND_PAY_ATTESTATION_ERROR:
                return "TAP_AND_PAY_ATTESTATION_ERROR - 15005";
            case TapAndPayStatusCodes.TAP_AND_PAY_UNAVAILABLE:
                return "TAP_AND_PAY_UNAVAILABLE - 15009";
            case TapAndPayStatusCodes.TAP_AND_PAY_SAVE_CARD_ERROR:
                return "TAP_AND_PAY_SAVE_CARD_ERROR - 15019";
            case TapAndPayStatusCodes.TAP_AND_PAY_INELIGIBLE_FOR_TOKENIZATION:
                return "TAP_AND_PAY_INELIGIBLE_FOR_TOKENIZATION - 15021";
            case TapAndPayStatusCodes.TAP_AND_PAY_TOKENIZATION_DECLINED:
                return "TAP_AND_PAY_TOKENIZATION_DECLINED - 15022";
            case TapAndPayStatusCodes.TAP_AND_PAY_CHECK_ELIGIBILITY_ERROR:
                return "TAP_AND_PAY_CHECK_ELIGIBILITY_ERROR - 15023";
            case TapAndPayStatusCodes.TAP_AND_PAY_TOKENIZE_ERROR:
                return "TAP_AND_PAY_TOKENIZE_ERROR - 15024";
            case TapAndPayStatusCodes.TAP_AND_PAY_TOKEN_ACTIVATION_REQUIRED:
                return "TAP_AND_PAY_TOKEN_ACTIVATION_REQUIRED - 15025";
            case Activity.RESULT_OK:
                return "Card link success";
            case Activity.RESULT_CANCELED:
                return "Card link canceled";
        }
        return "Error Unknown";
    }
}