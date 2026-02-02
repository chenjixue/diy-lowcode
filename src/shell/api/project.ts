import {projectSymbol, simulatorHostSymbol} from './symbols';
import InnerProject from '@/project/project.ts';
import {BuiltinSimulatorHost} from "@/host/host.tsx";
import {IPublicTypeProjectSchema} from "@/types";

const innerProjectSymbol = Symbol('innerProject');

export class Project {
    private readonly [innerProjectSymbol]: InnerProject;
    private [simulatorHostSymbol]: BuiltinSimulatorHost;
    get [projectSymbol](): InnerProject {
        return this[innerProjectSymbol];
    }

    constructor(project: InnerProject, public workspaceMode: boolean = false) {
        this[innerProjectSymbol] = project;
    }

    static create(project: Project, workspaceMode: boolean = false) {
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
