import { resolve } from "path";
import {
  DsgContext,
  CreateAuthModulesParams,
  AmplicationPlugin,
  Events,
  CreateAdminModulesParams,
} from "@amplication/code-gen-types";
import { EnumAuthProviderType } from "@amplication/code-gen-types/dist/models";

class JwtAuthPlugin implements AmplicationPlugin {
  static srcDir = "";
  
  register(): Events {
    return {
      createAdminModules: {
        before: this.beforeCreateAdminModules,
      },
      createAuthModules: {
        before: this.beforeCreateAuthModules,
        after: this.afterCreateAuthModules,
      }
    };
  }
  
  beforeCreateAdminModules(
    context: DsgContext,
    eventParams: CreateAdminModulesParams["before"]
  ) {
    context.appInfo.settings.authProvider = EnumAuthProviderType.Jwt;

    return eventParams;
  }

  beforeCreateAuthModules(
    context: DsgContext,
    eventParams: CreateAuthModulesParams["before"]
  ) {
    context.utils.skipDefaultBehavior = true;
    JwtAuthPlugin.srcDir = eventParams.srcDir;
    return eventParams;
  }

  async afterCreateAuthModules(
    context: DsgContext,
    eventParams: CreateAuthModulesParams["after"]
  ) {
    const staticPath = resolve(__dirname, "../static");
    const staticsFiles = await context.utils.importStaticModules(staticPath, JwtAuthPlugin.srcDir);

    return staticsFiles
  }
}

export default JwtAuthPlugin;
