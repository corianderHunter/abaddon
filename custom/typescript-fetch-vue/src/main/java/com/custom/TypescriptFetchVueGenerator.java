/*
 * @Author: weidonghua
 */

package com.custom;

import io.swagger.codegen.*;
import io.swagger.codegen.languages.AbstractTypeScriptClientCodegen;
import io.swagger.models.properties.*;

import java.util.*;
import java.io.File;

public class TypescriptFetchVueGenerator extends AbstractTypeScriptClientCodegen implements CodegenConfig {

  // source folder where to write the files
  protected String sourceFolder = "src";
  protected String apiVersion = "1.0.0";

  public CodegenType getTag() {
    return CodegenType.CLIENT;
  }

  public String getName() {



    
    return "typescript-fetch-vue";
  }

  public String getHelp() {
    return "Generates a typescript-fetch-vue client library.";
  }

  public TypescriptFetchVueGenerator() {
    super();

    // set the output folder here
    outputFolder = "generated-code/typescript-fetch-vue";
    templateDir = "typescript-fetch-vue";

    supportingFiles.add(new SupportingFile("index.mustache", "", "index.ts"));
    supportingFiles.add(new SupportingFile("api.mustache", "", "api.ts"));
    supportingFiles.add(new SupportingFile("configuration.mustache", "", "configuration.ts"));
    supportingFiles.add(new SupportingFile("custom.d.mustache", "", "custom.d.ts"));

    //vue adaptor
    supportingFiles.add(new SupportingFile("vue.index.mustache", "vue", "index.ts"));
  }

  @Override
  public String escapeReservedWord(String name) {
    return "_" + name;  // add an underscore to the name
  }

  @Override
  public String getTypeDeclaration(Property p) {
    Property inner;
    if(p instanceof ArrayProperty) {
      ArrayProperty mp1 = (ArrayProperty)p;
      inner = mp1.getItems();
      return this.getSwaggerType(p) + "<" + this.getTypeDeclaration(inner) + ">";
    } else if(p instanceof MapProperty) {
      MapProperty mp = (MapProperty)p;
      inner = mp.getAdditionalProperties();
      return "{ [key: string]: " + this.getTypeDeclaration(inner) + "; }";
    } else if(p instanceof FileProperty || p instanceof ObjectProperty) {
      return "any";
    } else {
      return super.getTypeDeclaration(p);
    }
  }
}