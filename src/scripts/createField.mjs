import strapi from 'strapi';

async function createFieldsInCollection() {
  // Initialize the Strapi app
  await strapi().load();

  // Specify the collection type where you want to add fields
  const collectionTypeName = 'Review'; // Replace with your actual collection type name

  // Define the fields you want to add
  const fieldsToAdd = [
    {
      name: 'newField1',
      type: 'string',
      label: 'New Field 1',
    },
    {
      name: 'newField2',
      type: 'integer',
      label: 'New Field 2',
    },
    // Add more fields as needed
  ];

  try {
    // Get the current collection type's model
    const collectionModel = strapi.models[collectionTypeName];

    if (!collectionModel) {
      throw new Error(`Collection type "${collectionTypeName}" not found.`);
    }

    // Create the fields in the collection type
    for (const field of fieldsToAdd) {
      await strapi.query('field').create({
        ...field,
        contentTypes: [collectionModel.id],
      });
    }

    console.log('Fields created successfully.');
  } catch (error) {
    console.error('Error creating fields:', error);
  }
}

createFieldsInCollection();
