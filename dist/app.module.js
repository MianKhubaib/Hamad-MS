"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const user_module_1 = require("./user/user.module");
const request_module_1 = require("./request/request.module");
const delivery_module_1 = require("./delivery/delivery.module");
const admin_module_1 = require("./admin/admin.module");
const transform_interceptor_1 = require("./interceptors/transform.interceptor");
const timeout_interceptor_1 = require("./interceptors/timeout.interceptor");
const core_1 = require("@nestjs/core");
const notification_module_1 = require("./notification/notification.module");
const utils_module_1 = require("./utils/utils.module");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot(),
            user_module_1.UserModule,
            request_module_1.RequestModule,
            delivery_module_1.DeliveryModule,
            admin_module_1.AdminModule,
            notification_module_1.NotificationModule,
            core_1.RouterModule.register([
                {
                    path: 'v1',
                    module: user_module_1.UserModule,
                },
                {
                    path: 'v1',
                    module: request_module_1.RequestModule,
                },
                {
                    path: 'v1',
                    module: admin_module_1.AdminModule,
                },
                {
                    path: 'v1',
                    module: delivery_module_1.DeliveryModule,
                },
                {
                    path: 'v1',
                    module: notification_module_1.NotificationModule,
                },
            ]),
            utils_module_1.UtilsModule,
            auth_module_1.AuthModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: transform_interceptor_1.TransformInterceptor,
            },
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: timeout_interceptor_1.TimeoutInterceptor,
            },
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map