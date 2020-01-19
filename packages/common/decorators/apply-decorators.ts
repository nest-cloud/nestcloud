export function applyDecorators(
    ...decorators: Array<ClassDecorator | MethodDecorator | PropertyDecorator>
) {
    return <TFunction extends Function, Y>(
        target: TFunction | Object,
        propertyKey?: string | symbol,
        descriptor?: TypedPropertyDescriptor<Y>,
    ) => {
        for (const decorator of decorators) {
            if (target instanceof Function) {
                (decorator as ClassDecorator)(target);
                continue;
            }
            (decorator as MethodDecorator | PropertyDecorator)(
                target,
                propertyKey,
                descriptor,
            );
        }
    };
}
