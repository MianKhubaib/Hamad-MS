"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = require("helmet");
const compression = require("compression");
const common_1 = require("@nestjs/common");
const exception_filter_1 = require("./filters/exception.filter");
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: ['error', 'warn', 'log', 'debug'],
    });
    app.enableCors();
    app.use((0, helmet_1.default)());
    app.use(compression());
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({ enableDebugMessages: true }));
    const { httpAdapter } = app.get(core_1.HttpAdapterHost);
    app.useGlobalFilters(new exception_filter_1.AllExceptionsFilter(httpAdapter));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Hamad')
        .setDescription('Hamad API description')
        .setVersion('1.0')
        .addTag('Hamad')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/apidocs', app, document);
    const port = process.env.PORT;
    await app.listen(port);
}
bootstrap();
//# sourceMappingURL=main.js.map