import { Container } from 'unstated';

const EmptyArray = Object.freeze([]);

class ContainerEx extends Container {
  static _visitDependencies(visited) {
    if (visited.has(this)) return;
    visited.add(this);
    
    const { Dependencies } = this;
    if (Dependencies) {
      Dependencies.forEach(Dep => {
        if (!Dep._visitDependencies) {
          throw new Error('Invalid dependency must be type that inherits from ContainerEx - ' + Dep);
        }
        Dep._visitDependencies(visited);
      });
    }
  }
  
  static getAllDependenciesRecursively() {
    if (!this._allDependencies) {
      const visited = new Set();

      this._visitDependencies(visited);

      visited.delete(this); // make sure we don't add ourselves to our own dependencies!
      this._allDependencies = Array.from(visited);
      //console.log("Deps:", this.name, this._allDependencies.map(D => D.name));
    }
    return this._allDependencies;
  }
}

export default ContainerEx;