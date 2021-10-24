export class Recipe {
  public name: string;
  public description: string;
  public imagePath: string;

  constructor(name: string, descrpition: string, imagePath: string){
    this.name = name;
    this.description = descrpition;
    this.imagePath = imagePath;
  }
}
