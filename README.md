This project is aimed to create a advanced sort razor view component (for Kendo) in a .NET class library, for the purpose of reusability and modularity. 
However, it’s not a built-in functionality from ASP.NET MVC and takes some custom work to set up, as explained in this document. 

********************************************************

This project uses RazorGenerator to help us embed the razor view into the class library. 
Refer here https://github.com/RazorGenerator/RazorGenerator

RazorGenerator is a Custom Tool for Visual Studio that allows processing Razor files at design time instead of runtime, 
allowing them to be built into an assembly for simpler reuse and distribution.

********************************************************

/*Install the RazorGenerator*/ 

This is a important step and a pre-requisite to work with this project!!!

The Razor Single File Generator installer is available in the Visual Studio Extensions Gallery.
To install, kindly open the Visual Studio Extension Manager ("Extentions" → "Manage Extension") and search the OnlineGallery for “Razor Generator”.

********************************************************

/*Runtime compilation of CSHTML file*/

Open up the properties for the cshtml file and set its Custom Tool property to 'RazorGenerator' and hit enter.
This would generate the {viewname}.generated.cs file and put it under the view. 
You must do this whenever you create a new cshtml file. 
Any update after to the cshtml will automatically trigger an event that would regenerate the {viewname}.generated.cs file

********************************************************

/*In a nutshell*/

When working with this project:

    - Install the RazorGenerator extention to your visual studio.
    - When creating a new cshtml file, set its Custom Tool property to RazorGenerator
    - When adding a new javascript or css file, go to the property window and set the Build Action to 'Embedded Resource'

When creatng a new class library project similar to this:
 
    - Create a new C# project using the Class Library template, for framework version 4.8
    - Change Project Properties Build output path to bin\ (not bin\Debug) for both Debug and Release
    - Using Nuget Package manager add the following packages:
        - Microsoft.AspNet.Razor
        - Microsoft.AspNet.WebPages
        - Microsoft.Web.Infrastructure
        - Microsoft.AspNet.Web.Optimization
        - Microsoft.AspNet.Mvc
        - RazorGenerator.Mvc
        - PrecompiledMvcViewEngineContrib
    
    You also need to do the follwing change to your new class library project, to enable mvc intellisense and to have Mvc Razore Views in the Add New Item dialog box.

    - Add ProjectTypeGuids to .csproj (edit as text) after ProjectGUID: 
      <ProjectTypeGuids>{349c5851-65df-11da-9384-00065b846f21};{fae04ec0-301f-11d3-bf4b-00c04f79efbc}</ProjectTypeGuids>

    - Add a web.config file to the view folder. The Visual Studio editor expects to see this file to render Razor Views.
      You can copy the one you see in this project and update the dependencies if needed

                                    OR

    - Simply create the regular ASP.NET MVC project (because ASP.NET MVC project will also output as class library) and remove all the unwanted files.
    - You can refer this project strcture to get the details on what to keep and what to delete.
    - This is the recommended way

********************************************************

/*Usage*/

This component is a asp.net mvc driven class library project, so the client project can use this compenent by referencing to this project dll.

Pre-Requisite:

    - This component is created for ASP.NET MVC 5, so the client ptoject should also be ASP.NET MVC 5
    - This project is a custom component extention for Kendo MVC dll. So the client project must have all the Kendo MVC references added.
    - This project also have components intracts with Kendo Grid that is rendered using FirstStrike.Retail.GridBuilder, so the client project must have support for FirstStrike.Retail.GridBuilder.

Web.Config Change:

    - This project delivers static resources (e.g. js file) via a HTTP Handler, so the client project must add the following handlers to the web.config

    <system.web>
        <httpHandlers>
		    <add path="KendoComponentMvcResource.axd" verb="GET" type="Kendo.Component.AdvancedSort.Mvc.WebResourceHandler, Kendo.Component.AdvancedSort.Mvc"/>
        </httpHandlers>
    </system.web>
    <system.webServer>
        <handlers>
            <add name="KendoMvcResourceHandler" path="KendoComponentMvcResource.axd" verb="GET" type="Kendo.Component.AdvancedSort.Mvc.WebResourceHandler, Kendo.Component.AdvancedSort.Mvc" preCondition="integratedMode" />
	    </handlers>
    </system.webServer>

Adding the component to the View:

    First add dependencies

        - Add reference to the Kendo.Component.AdvancedSort.Mvc.dll
        - Using Nuget Package manager add the RazorGenerator.Mvc package
    
    Then use any of the following option to configure your page to have advansed sort

        - Using MVC HTMLHelper (recommended)

            Basic: 
                @Html.AdvancedSortFor("{grid-name}")

            With Custom Style to Buttons: 
                @Html.AdvancedSortFor("{grid-name}", new { ButtonOpenSortStyle = "margin: 0", ButtonClearSortStyle = "margin: 0" })

            With Excluded Column List: 
                @Html.AdvancedSortFor("{grid-name}", new List<string>{ "Column1", "Column2" })

            With default style to Sort Inidcator:
                @Html.AdvancedSortFor("{grid-name}", new { UseDefaultSortIconStyle: true })

                You can use this switch, if you see the sort indicator style looks wired after adding the advanced sort

            With no auto intialize:
                @Html.AdvancedSortFor("{grid-name}", new { PreventAutoInitialize: true })

                When this switch is set to default. The component is added to the view but not intialised. You have to manually intilise from your javascript code using the below code.
                    $('#{grid-name}').AdvancedSortGridExtention().init();
                This is helpful in case like, the grid refreshes based on a dropdown change event. You put this, after the code that loads/refresh the grid. 

        - Using Javascript code. This is usefull when you are required to add Advanced Sort dynamically.

            1. Load the Static resources to the page but putting the below code on the top of the page
                 @using Kendo.Component.AdvancedSort.Mvc
                 @Html.AdvancedSortSharedResource()

            2. Create a placeholder for the advanced sort control to load in, like this <div id="advancedSortPanel"></div>. This would usually goes inside the grid toolbar container.

            3. Intialise the sort like below. This should be called after the grid is initialised. 
                $("#advancedSortPanel").AdvancedSort({
                    gridName: 'your-grid-name',             //required
                    excludedColumn: [],                     //optional
                    buttonOpenSortStyle: 'margin: 0',       //optional
                    buttonClearSortStyle: 'margin: 0'       //optional
                });
