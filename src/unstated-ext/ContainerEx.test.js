import ContainerEx from './ContainerEx';

it('resolves dependencies', () => {

  class A extends ContainerEx {
    static get Dependencies() {
      return [C];
    };
  }

  class B extends ContainerEx {
    static get Dependencies() {
      return [A];
    };
  }

  class C extends ContainerEx {
    static get Dependencies() {
      return [A, B];
    };
  }

  expect(A.getAllDependenciesRecursively()).toIncludeSameMembers([B, C]);
  expect(B.getAllDependenciesRecursively()).toIncludeSameMembers([A, C]);
  expect(C.getAllDependenciesRecursively()).toIncludeSameMembers([A, B]);
});