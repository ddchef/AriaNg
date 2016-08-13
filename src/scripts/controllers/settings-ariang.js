(function () {
    'use strict';

    angular.module('ariaNg').controller('AriaNgSettingsController', ['$rootScope', '$scope', '$timeout', 'ariaNgLanguages', 'ariaNgCommonService', 'ariaNgSettingService', 'ariaNgNotificationService', function ($rootScope, $scope, $timeout, ariaNgLanguages, ariaNgCommonService, ariaNgSettingService, ariaNgNotificationService) {
        var tabOrders = ['global', 'rpc'];

        $scope.context = {
            currentTab: 'global',
            languages: ariaNgLanguages,
            availableTime: ariaNgCommonService.getTimeOptions([1000, 2000, 3000, 5000, 10000, 30000, 60000], true),
            trueFalseOptions: [{name: 'True', value: true}, {name: 'False', value: false}],
            settings: ariaNgSettingService.getAllOptions()
        };


        $scope.changeTab = function (tabName) {
            $scope.context.currentTab = tabName;
        };

        $rootScope.swipeActions.extentLeftSwipe = function () {
            var tabIndex = tabOrders.indexOf($scope.context.currentTab);

            if (tabIndex < tabOrders.length - 1) {
                $scope.changeTab(tabOrders[tabIndex + 1]);
                return true;
            } else {
                return false;
            }
        };

        $rootScope.swipeActions.extentRightSwipe = function () {
            var tabIndex = tabOrders.indexOf($scope.context.currentTab);

            if (tabIndex > 0) {
                $scope.changeTab(tabOrders[tabIndex - 1]);
                return true;
            } else {
                return false;
            }
        };

        $scope.settingService = ariaNgSettingService;

        $scope.isSupportNotification = function () {
            return ariaNgNotificationService.isSupportBrowserNotification() &&
                ariaNgSettingService.isUseWebSocket($scope.context.settings.protocol);
        };

        $scope.setEnableBrowserNotification = function (value) {
            ariaNgSettingService.setBrowserNotification(value);

            if (value && !ariaNgNotificationService.hasBrowserPermission()) {
                ariaNgNotificationService.requestBrowserPermission(function (permission) {
                    if (!ariaNgNotificationService.isPermissionGranted(permission)) {
                        $scope.context.settings.browserNotification = false;
                        ariaNgCommonService.showError('You have disabled notification in your browser. You should change your browser\'s settings before you enable this function.');
                    }
                });
            }
        };

        $rootScope.loadPromise = $timeout(function () {}, 100);
    }]);
}());
