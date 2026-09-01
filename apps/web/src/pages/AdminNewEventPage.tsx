const result = await presign ( file, token );

await fetch( result.uploadUrl,
    {
        method: "PUT",

        headers: {
            "Content-Type":
              file.type
        },

        body: file
    }
)