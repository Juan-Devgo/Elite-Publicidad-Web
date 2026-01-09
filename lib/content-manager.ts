import qs from 'qs';

export const CMS_BASE_URL =
  import.meta.env.PUBLIC_CMS_URL ?? 'http://localhost:1337';

export async function getNavbar() {
  const query = qs.stringify(
    {
      populate: {
        logo: {
          fields: ['name', 'alternativeText', 'url', 'formats'],
        },
        paginas: {
          populate: {
            subpaginas: true,
          },
        },
        redes: {
          populate: {
            icono: {
              fields: ['name', 'alternativeText', 'url', 'formats'],
            },
          },
        },
      },
    },
    { encodeValuesOnly: true }
  );

  const content = await getContent('/api/navbar' + '?' + query);
  return content?.data;
}

export async function getFooter() {
  const query = qs.stringify(
    {
      populate: {
        logo: {
          fields: ['name', 'alternativeText', 'url', 'formats'],
        },
        parrafos: true,
        redes: {
          populate: {
            icono: true,
          },
        },
      },
    },
    { encodeValuesOnly: true }
  );

  const content = await getContent('/api/footer' + '?' + query);
  return content?.data;
}

export async function getHeaderInicio() {
  const query = qs.stringify(
    {
      populate: {
        fondo: {
          fields: ['name', 'alternativeText', 'url', 'formats'],
        },
        callToAction: true, // o { populate: "*" }
      },
    },
    { encodeValuesOnly: true }
  );

  const content = await getContent('/api/header-inicio' + '?' + query);
  return content?.data;
}

export async function getContent(url: string) {
  console.log('Fetching content from:', CMS_BASE_URL + url);

  try {
    const response = await fetch(CMS_BASE_URL + url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error('Error fetching content:', error);
    return null;
  }
}
