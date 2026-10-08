using Chattappinlamning.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
//Registrerar SignalR-tjänsten som behövs för att använda hubbar.
builder.Services.AddSignalR();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

//Omdirigerar från HTTP till HTTPS.
app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapHub<ChatHub>("/chatHub");
app.MapRazorPages()
   .WithStaticAssets();

app.Run();
