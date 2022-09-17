// Provider Maintenance Popup
new Vue({
    el: "#provider_maintenance_popup",
    mixins: [mixin],
    data: {
        culture: "",
        providerMaintenanceList: [],
        newMaintenanceList: []
    },
    methods: {
        getProviderMaintenanceMainList: function () {
            var self = this;
            const expiresTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1); // 當天有效時間
            ApiPost("/api/Cms/GetProviderMaintenancePopUpInfo", { RangeType: 3 }, function (response) {
                if (response.data.Data != null && response.data.Data.Category.length > 0) {
                    response.data.Data.Category.forEach(item =>
                        self.providerMaintenanceList.push({
                            ProviderLogo: item.ProviderLogo,
                            ProviderId: item.ProviderId,
                            ProviderName: item.DisplayValue,
                            NextCloseTime: item.NextCloseTime,
                            NextOpenTime: item.NextOpenTime,
                            OffsetGmt: item.OffsetGmt,
                            IsActive: item.IsActive,
                            UntilNotice: item.UntilNotice
                        })
                    );
                    response.data.Data.Category.forEach(item =>
                        self.newMaintenanceList.push({
                            ProviderId: item.ProviderId,
                            NextCloseTime: item.NextCloseTime,
                            NextOpenTime: item.NextOpenTime,
                            UntilNotice: item.UntilNotice
                        })
                    );

                    var isChanged = false;
                    var storageKey = "newMaintenanceList";
                    var newMaintenanceList = localStorage.getItem("newMaintenanceList");
                    if (newMaintenanceList != null) {
                        if (newMaintenanceList != JSON.stringify(self.newMaintenanceList)) {
                            isChanged = true; // 資料有變更
                            // 儲存資料
                            localStorage.setItem(storageKey, JSON.stringify(self.newMaintenanceList));
                        }
                    } else {
                        // 儲存資料
                        localStorage.setItem(storageKey, JSON.stringify(self.newMaintenanceList));
                    }

                    if (isNullOrWhitespace($.cookie("isShowProviderMaintenancePop")) || $.cookie("isShowProviderMaintenancePop") == "false") {
                        self.popProviderMaintenancePop();
                        $.cookie("isShowProviderMaintenancePop", "true", { expires: expiresTime, path: '/' });
                    } else {
                        // 維護資料有變更
                        if (isChanged) {
                            self.popProviderMaintenancePop();
                        }
                    }
                }
            })
        },
        popProviderMaintenancePop: function () {
            $('#provider_maintenance_popup').fadeIn();
            $('#dialog-mask').show();
        },
        closeProviderMaintenancePop: function () {
            $('#provider_maintenance_popup').fadeOut();
            $('#dialog-mask').hide();
        }
    },
    created: function () {
        if (isNullOrWhitespace($.cookie("isShowProviderMaintenancePop"))) {
            const expiresTime = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1); // 當天有效時間
            $.cookie("isShowProviderMaintenancePop", "false", { expires: expiresTime, path: '/' });
        }
        this.getProviderMaintenanceMainList();
    }
})