import { editorSymbol, projectSymbol, simulatorHostSymbol, documentSymbol } from './symbols';
// import { SimulatorHost } from './simulator-host';
import { SimulatorHost } from './simulator-host';
// import { getLogger } from '@alilc/lowcode-utils';
const innerProjectSymbol = Symbol('innerProject');
export class Project implements IPublicApiProject {
    private readonly [innerProjectSymbol]: InnerProject;
    private [simulatorHostSymbol]: BuiltinSimulatorHost;
    get [projectSymbol](): InnerProject {
        return this[innerProjectSymbol];
    }
    constructor(project: InnerProject, public workspaceMode: boolean = false) {
        this[innerProjectSymbol] = project;
    }

    static create(project: InnerProject, workspaceMode: boolean = false) {
        return new Project(project, workspaceMode);
    }
    /**
     * 导入 project
     * @param schema 待导入的 project 数据
     */
    importSchema(schema?: IPublicTypeProjectSchema): void {
        this[projectSymbol].load(schema, true);
    }
}
