
export default await (async () => {
const __VLS_setup = async () => {
defineProps({
  ...$variantsProps('button')
})
const __VLS_Component = (await import('vue')).defineComponent({
props: ({
  ...$variantsProps('button')
}),
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

let __VLS_name!: 'Block';
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
type __VLS_StyleScopedClasses = {}
 & { 'primary'?: boolean };
let __VLS_styleScopedClasses!: __VLS_StyleScopedClasses | keyof __VLS_StyleScopedClasses | (keyof __VLS_StyleScopedClasses)[];
/* CSS variable injection */
{
<button class={({ ...__VLS_ctx.$props })} ></button>
__VLS_styleScopedClasses = ({ ...$props });
[$props,];
{
<p ></p>
( __VLS_ctx.$props );
[$props,];
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

declare const $dt: import('@nuxtjs/design-tokens').DtFunctionType
type ComponentTemplateTags__VLS = {
  /**
   * The `<button>` tag from the Vue template.
   */
  button: true,
  /**
   * The `<p>` tag from the Vue template.
   */
  p: true,

}

declare const $variantsProps: (key: keyof ComponentTemplateTags__VLS) => {}
declare const css: (declaration: import('@nuxtjs/design-tokens').CSS<ComponentTemplateTags__VLS, import('@nuxtjs/design-tokens').NuxtStyleTheme>) => any
const __VLS_css = css({
  button: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '16px',
    width: '320px',
    height: '320px',
    border: '4px solid {colors.black}',
    position: 'relative',
    '&:hover': {
      border: '4px solid {colors.velvet}'
    },
    '& > p': {
      fontSize: '24px',
    },
    "@dark": {
      "& > p": {
        color: 'red'
      }
    },
    "@light": {
      "& > p": {
        color: 'blue'
      }
    },
    "@screen:lg": {
      "& > p": {
        border: "2px solid red"
      }
    },
    variants: {
      primary: {
        backgroundColor: '{colors.primary.900}',
      },
      black: {
        backgroundColor: '{colors.black}',
      },
      lavender: {
        backgroundColor: '{colors.lavender}'
      },
      lila: {
        backgroundColor: '{colors.lila}'
      },
      velvet: {
        backgroundColor: '{colors.velvet}'
      },
      grape: {
        backgroundColor: '{colors.grape}'
      },
      rounded: {
        borderRadius: '50%'
      },
      padded: {
        padding: '4rem'
      },
    }
  }
})
