import {Decorator} from '../../reflection/Decorator';
import {Class} from '../../reflection/Class';
import {ApplicationContext} from '../context/ApplicationContext';


export class BootDecorator extends Decorator {
    protected async onClass(klass: Class<any>) {
        try {
            const context: ApplicationContext = new ApplicationContext();

            context.scan(klass.type);

            await context.initialize();
            await context.start();
        } catch (e) {
            /* tslint:disable:no-console */
            console.error('Application boot failed:\n%s', e.stack);
        }
    }
}