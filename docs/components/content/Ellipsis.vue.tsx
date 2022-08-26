function __VLS_template() {
import * as __VLS_types from './__VLS_types.js';
const __VLS_types: typeof import('./__VLS_types.js');

const __VLS_options = {
};

const __VLS_name = undefined;
let __VLS_ctx!: __VLS_types.PickNotAny<__VLS_Ctx, {}> & InstanceType<__VLS_types.PickNotAny<typeof __VLS_component, new () => {}>> & {
};
let __VLS_vmUnwrap!: typeof __VLS_options & { components: { } };
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_component extends { components: infer C } ? C : {}> & __VLS_types.GlobalComponents & typeof __VLS_vmUnwrap.components & __VLS_types.PickComponents<typeof __VLS_ctx>;
let __VLS_selfComponent!: __VLS_types.SelfComponent<typeof __VLS_name, typeof __VLS_component & (new () => { $slots: typeof __VLS_slots })>;
let __VLS_components!: typeof __VLS_otherComponents & Omit<typeof __VLS_selfComponent, keyof typeof __VLS_otherComponents>;
__VLS_components./* __VLS_.SearchTexts.Components */;
({} as __VLS_types.GlobalAttrs)./* __VLS_.SearchTexts.GlobalAttrs */;
/* Style Scoped */
type __VLS_StyleScopedClasses = {}
 & { 'ellipsis'?: boolean };
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
{
<div class={"\u0061\u0062\u0073\u006f\u006c\u0075\u0074\u0065\u0020\u006c\u0065\u0066\u0074\u002d\u0030\u0020\u0074\u006f\u0070\u002d\u0030\u0020\u0077\u002d\u0066\u0075\u006c\u006c\u0020\u006d\u0061\u0078\u002d\u0077\u002d\u0066\u0075\u006c\u006c"} ></div>
{
<div class={"\u0065\u006c\u006c\u0069\u0070\u0073\u0069\u0073"} />
}
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
__VLS_styleScopedClasses['absolute'];
__VLS_styleScopedClasses['left-0'];
__VLS_styleScopedClasses['top-0'];
__VLS_styleScopedClasses['w-full'];
__VLS_styleScopedClasses['max-w-full'];
__VLS_styleScopedClasses['ellipsis'];
}
declare var __VLS_slots:
{
};
return __VLS_slots;
}
const __VLS_component = (await import('vue')).defineComponent({});
export default {} as any