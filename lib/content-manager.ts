import qs from "qs";

export const CMS_BASE_URL =
  import.meta.env.PUBLIC_CMS_URL ?? "http://localhost:1337";

const MEDIA_FIELDS = ["name", "alternativeText", "url", "formats"];
const MEDIA = { fields: MEDIA_FIELDS };

export async function getNavbar() {
  const query = qs.stringify(
    {
      populate: {
        logo: {
          fields: ["name", "alternativeText", "url", "formats"],
        },
        paginas: {
          populate: {
            subpaginas: true,
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const content = await getContent("/api/navbar" + "?" + query);
  return content?.data;
}

export async function getFooter() {
  const query = qs.stringify(
    {
      populate: {
        logo: {
          fields: ["name", "alternativeText", "url", "formats"],
        },
        callToAction: true,
        servicios: {
          populate: {
            subpaginas: true,
          },
        },
        conocenos: {
          populate: true,
        },
        redes: {
          populate: {
            icono: true,
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const content = await getContent("/api/footer" + "?" + query);
  return content?.data;
}

export async function getHeaderInicio() {
  const query = qs.stringify(
    {
      populate: {
        fondo: {
          fields: ["name", "alternativeText", "url", "formats"],
        },
        callToAction: true, // o { populate: "*" }
      },
    },
    { encodeValuesOnly: true },
  );

  const content = await getContent("/api/header-inicio" + "?" + query);
  return content?.data;
}

/** Single type `servicios-inicio`: los círculos de servicios del home. */
export async function getServiciosInicio() {
  const query = qs.stringify(
    {
      populate: {
        servicios: {
          populate: {
            imagen: MEDIA,
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const content = await getContent("/api/servicios-inicio" + "?" + query);
  return content?.data;
}

/** Single type `horario-ubicacion`: horario de atención + ubicación del home. */
export async function getHorarioUbicacion() {
  const query = qs.stringify(
    {
      populate: {
        horarios: true,
        ubicaciones: true,
        callToAction: true,
      },
    },
    { encodeValuesOnly: true },
  );

  const content = await getContent("/api/horario-ubicacion" + "?" + query);
  return content?.data;
}

/** Single type `galeria-inicio`: galería de trabajos realizados del home. */
export async function getGaleriaInicio() {
  const query = qs.stringify(
    {
      populate: {
        trabajos: {
          populate: {
            image: MEDIA,
          },
        },
        callToAction: true,
      },
    },
    { encodeValuesOnly: true },
  );

  const content = await getContent("/api/galeria-inicio" + "?" + query);
  return content?.data;
}

/**
 * Collection type `servicios`: una entrada por página de servicio
 * (impresiones, visibilidad, insumos, estructuras), identificada por `slug`.
 */
export async function getServicio(slug: string) {
  const query = qs.stringify(
    {
      filters: {
        slug: { $eq: slug },
      },
      populate: {
        imagen: MEDIA,
        callToAction: true,
        puntosClave: true,
        categorias: {
          populate: {
            imagen: MEDIA,
            items: true,
          },
        },
        trabajos: {
          populate: {
            image: MEDIA,
          },
        },
        cierre: {
          populate: {
            callToAction: true,
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const content = await getContent("/api/servicios" + "?" + query);
  return content?.data?.[0] ?? null;
}

export async function getWhatsAppButton() {
  const query = qs.stringify(
    {
      populate: {
        foto_perfil: {
          fields: ["name", "alternativeText", "url", "formats"],
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const content = await getContent("/api/whatsapp-button" + "?" + query);
  return content?.data;
}

export async function getContactBar() {
  const query = qs.stringify(
    {
      populate: {
        telefonos: true,
        redes: {
          populate: {
            icono: {
              fields: ["name", "alternativeText", "url", "formats"],
            },
          },
        },
      },
    },
    { encodeValuesOnly: true },
  );

  const content = await getContent("/api/footer-contacto" + "?" + query);
  return content?.data;
}

export async function getContent(url: string) {
  console.log("Fetching content from:", CMS_BASE_URL + url);

  try {
    const response = await fetch(CMS_BASE_URL + url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
}
