
export default await (async () => {
const __VLS_setup = async () => {
useHead({
  title: 'Theme Module'
})
const __VLS_Component = (await import('vue')).defineComponent({
setup() {
return {
};
},
});
function __VLS_template() {
import * as __VLS_types from './__VLS_types.js';
const __VLS_types: typeof import('./__VLS_types.js');

const __VLS_options = {
};

let __VLS_name!: 'index';
let __VLS_ctx!: __VLS_types.PickNotAny<__VLS_Ctx, {}> & InstanceType<__VLS_types.PickNotAny<typeof __VLS_Component, new () => {}>> & InstanceType<__VLS_types.PickNotAny<typeof __VLS_component, new () => {}>> & {
};
let __VLS_vmUnwrap!: typeof __VLS_options & { components: { } };
/* Components */
let __VLS_otherComponents!: NonNullable<typeof __VLS_component extends { components: infer C } ? C : {}> & __VLS_types.GlobalComponents & typeof __VLS_vmUnwrap.components & __VLS_types.PickComponents<typeof __VLS_ctx>;
let __VLS_selfComponent!: __VLS_types.SelfComponent<typeof __VLS_name, typeof __VLS_component & (new () => { $slots: typeof __VLS_slots })>;
let __VLS_components!: typeof __VLS_otherComponents & Omit<typeof __VLS_selfComponent, keyof typeof __VLS_otherComponents>;
__VLS_components./* __VLS_.SearchTexts.Components */;
({} as __VLS_types.GlobalAttrs)./* __VLS_.SearchTexts.GlobalAttrs */;
/* Style Scoped */
type __VLS_StyleScopedClasses = {};
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
{
<div ></div>
{
<h1 ></h1>
}
}
if (typeof __VLS_styleScopedClasses === 'object' && !Array.isArray(__VLS_styleScopedClasses)) {
}
declare var __VLS_slots:
{
};
return __VLS_slots;
}
const __VLS_component = (await import('vue')).defineComponent({
setup() {
return {
};
},
});
return {} as typeof __VLS_Component & (new () => { $slots: ReturnType<typeof __VLS_template> });
};
return await __VLS_setup();
})();
