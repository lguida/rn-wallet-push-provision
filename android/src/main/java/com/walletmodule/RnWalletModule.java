package com.walletmodule;

import android.app.Activity;
import android.provider.Settings.Secure;
import android.content.Intent;
import com.facebook.react.bridge.*;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.Map;
import java.util.HashMap;

import android.util.Log;

public class RnWalletModule extends ReactContextBaseJavaModule {

    private String deviceId;
    private Promise mPushProvisionPromise;
    private Promise mCreateWalletPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {
        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == GooglePay.REQUEST_CODE_PUSH_TOKENIZE) {
                if (mPushProvisionPromise != null) {
                    if (resultCode == Activity.RESULT_CANCELED) {
                        mPushProvisionPromise.reject("Push provision was cancelled");
                    } else if (resultCode == Activity.RESULT_OK) {
                        
                        mPushProvisionPromise.resolve("PUSH_PROVISION_SUCCESS");
                    
                    }

                    mPushProvisionPromise = null;
                }
            } else if (requestCode == GooglePay.REQUEST_CREATE_WALLET) {
                if (mCreateWalletPromise != null) {
                    if (resultCode == Activity.RESULT_CANCELED) {
                        mCreateWalletPromise.reject("Create wallet was cancelled");
                    } else if (resultCode == Activity.RESULT_OK) {
                        mCreateWalletPromise.resolve("NEW_WALLET_CREATED");
                    }

                    mPushProvisionPromise = null;
                }
            }

        }
    };

    RnWalletModule(ReactApplicationContext reactContext) {
        super(reactContext);

        reactContext.addActivityEventListener(mActivityEventListener);

        deviceId = Secure.getString(reactContext.getContentResolver(),Secure.ANDROID_ID);
    }

    // declare package name for JavaScript
    @Override
    public String getName() {
        return "RnWalletModule";
    }

    @ReactMethod
    public void checkIfAlreadyAdded(String last4, String cardNetwork, Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();

            GooglePay GooglePay = new GooglePay(currentActivity);

            GooglePay.checkIfAlreadyAdded(last4, cardNetwork, promise);

        } catch (Exception e) {
            promise.reject("RnWalletModule Error", e);
        }
    }

    @ReactMethod
    public void getDeviceId(Promise promise) {
        try {
            Log.d("RnWalletModule.getDeviceId",this.deviceId);
            promise.resolve(this.deviceId);

        } catch (Exception e) {
            promise.reject("getDeviceId Error", e);
        }
    }

    @ReactMethod
    public void getWalletId(Promise promise) {
        try {
            Activity currentActivity = getCurrentActivity();
            GooglePay GooglePay = new GooglePay(currentActivity);

            GooglePay.getWalletId(promise);



        } catch (Exception e) {
            promise.reject("getWalletAndDeviceId Error", e);
        }
    }

    @ReactMethod
    public void handleAddToGooglePay(
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
            String cardNetwork,
            Promise promise) {

        mPushProvisionPromise = promise;

        Activity currentActivity = getCurrentActivity();

        GooglePay GooglePay = new GooglePay(currentActivity);

        GooglePay.handleAddToGooglePayClick(
                opaquePaymentCard,
                cardHolderName,
                addressline1,
                city,
                state,
                country,
                postalcode,
                mobileNumb,
                cardLabel,
                cardLast4,
                cardNetwork);

    }
}