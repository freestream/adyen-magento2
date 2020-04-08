/**
 *                       ######
 *                       ######
 * ############    ####( ######  #####. ######  ############   ############
 * #############  #####( ######  #####. ######  #############  #############
 *        ######  #####( ######  #####. ######  #####  ######  #####  ######
 * ###### ######  #####( ######  #####. ######  #####  #####   #####  ######
 * ###### ######  #####( ######  #####. ######  #####          #####  ######
 * #############  #############  #############  #############  #####  ######
 *  ############   ############  #############   ############  #####  ######
 *                                      ######
 *                               #############
 *                               ############
 *
 * Adyen Payment module (https://www.adyen.com/)
 *
 * Copyright (c) 2015 Adyen BV (https://www.adyen.com/)
 * See LICENSE.txt for license details.
 *
 * Author: Adyen <magento@adyen.com>
 */
/*browser:true*/
/*global define*/
define(
    [
        'uiComponent',
        'Magento_Checkout/js/model/payment/renderer-list',
        'Adyen_Payment/js/model/adyen-payment-service'
    ],
    function (
        Component,
        rendererList,
        adyenPaymentService
    ) {
        'use strict';
        rendererList.push(
            {
                type: 'adyen_oneclick',
                component: 'Adyen_Payment/js/view/payment/method-renderer/adyen-oneclick-method'
            },
            {
                type: 'adyen_cc',
                component: 'Adyen_Payment/js/view/payment/method-renderer/adyen-cc-method'
            },
            {
                type: 'adyen_hpp',
                component: 'Adyen_Payment/js/view/payment/method-renderer/adyen-hpp-method'
            },
            {
                type: 'adyen_boleto',
                component: 'Adyen_Payment/js/view/payment/method-renderer/adyen-boleto-method'
            },
            {
                type: 'adyen_apple_pay',
                component: 'Adyen_Payment/js/view/payment/method-renderer/adyen-apple-pay-method'
            },
            {
                type: 'adyen_pos_cloud',
                component: 'Adyen_Payment/js/view/payment/method-renderer/adyen-pos-cloud-method'
            },
            {
                type: 'adyen_google_pay',
                component: 'Adyen_Payment/js/view/payment/method-renderer/adyen-google-pay-method'
            }
        );
        /** Add view logic here if needed */
        return Component.extend({
            initialize: function () {
                var self = this;
                this._super();

                // reset variable:
                adyenPaymentService.setPaymentMethods();

                adyenPaymentService.retrieveAvailablePaymentMethods(function () {
                    var paymentMethods = adyenPaymentService.getAvailablePaymentMethods();
                    console.log(paymentMethods);
                    if (!!window.checkoutConfig.payment.adyenHpp) {
                        if (JSON.stringify(paymentMethods).indexOf("ratepay") > -1) {
                            var ratePayId = window.checkoutConfig.payment.adyenHpp.ratePayId;
                            var dfValueRatePay = self.getRatePayDeviceIdentToken();

                            window.di = {
                                t: dfValueRatePay.replace(':', ''),
                                v: ratePayId,
                                l: 'Checkout'
                            };

                            // Load Ratepay script
                            var ratepayScriptTag = document.createElement('script');
                            ratepayScriptTag.src = "//d.ratepay.com/" + ratePayId + "/di.js";
                            ratepayScriptTag.type = "text/javascript";
                            document.body.appendChild(ratepayScriptTag);
                        }
                    }
                });

                // include checkout card component javascript
                var checkoutCardComponentScriptTag = document.createElement('script');
                checkoutCardComponentScriptTag.id = "AdyenCheckoutCardComponentScript";
                checkoutCardComponentScriptTag.src = self.getCheckoutCardComponentSource();
                checkoutCardComponentScriptTag.type = "text/javascript";
                document.head.appendChild(checkoutCardComponentScriptTag);

                if (this.isGooglePayEnabled()) {
                    var googlepayscript = document.createElement('script');
                    googlepayscript.src = "https://pay.google.com/gp/p/js/pay.js";
                    googlepayscript.type = "text/javascript";
                    document.head.appendChild(googlepayscript);
                }
            },
            getCheckoutCardComponentSource: function() {
                return window.checkoutConfig.payment.checkoutCardComponentSource;
            },
            isGooglePayEnabled: function() {
                return window.checkoutConfig.payment.adyenGooglePay.active;
            },
            getRatePayDeviceIdentToken: function () {
                return window.checkoutConfig.payment.adyenHpp.deviceIdentToken;
            },
        });
    }
);
