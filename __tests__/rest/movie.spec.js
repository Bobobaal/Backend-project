const { tables } = require('../../src/data');
const { withServer, login, loginTrusted, loginAdmin } = require('../supertest.setup');

const data = {
  movies: [{
    id: '01d7b6aa-076a-473e-b798-9a991e2038c3',
    title: 'Alita Battle Angel',
    releaseYear: 2019,
    synopsis: `A deactivated cyborg's revived, but can't remember anything of her past and goes on a quest to find out who she is.`,
    imdbLink: `https://www.imdb.com/title/tt0437086/`
  },
  {
    id: '8d96cc76-522c-49c9-aad7-a39546d2d94b',
    title: 'Star Trek: The Future Begins',
    releaseYear: 2009,
    synopsis: `The brash James T. Kirk tries to live up to his father's legacy with Mr. Spock keeping him in check as a vengeful Romulan from the future creates black holes to destroy the Federation one planet at a time.`,
    imdbLink: `https://www.imdb.com/title/tt0796366/`
  },
  {
    id: 'b049a745-f10f-4cad-a887-59f876e8a72c',
    title: 'Stargate',
    releaseYear: 1994,
    synopsis: `An interstellar teleportation device, found in Egypt, leads to a planet with humans resembling ancient Egyptians who worship the god Ra.`,
    imdbLink: `https://www.imdb.com/title/tt0111282/`
  },
  {
    id: 'dfbec5b6-53b3-40ff-accd-e85a4e0dd1db',
    title: 'Notting Hill',
    releaseYear: 1999,
    synopsis: `The life of a simple bookshop owner changes when he meets the most famous film star in the world.`,
    imdbLink: `https://www.imdb.com/title/tt0125439/`
  },
  ],
};

const dataToDelete = {
  movies: [
    '01d7b6aa-076a-473e-b798-9a991e2038c3',
    '8d96cc76-522c-49c9-aad7-a39546d2d94b',
    'b049a745-f10f-4cad-a887-59f876e8a72c',
    'dfbec5b6-53b3-40ff-accd-e85a4e0dd1db'
  ]
};

describe('Movies', () => {
  let request;
  let knex;
  let loginHeader;
  let loginHeaderTrusted;
  let loginHeaderAdmin;

  withServer(({knex: k, supertest:s}) => {
    knex = k;
    request = s;
  })

  beforeAll(async () => {
    loginHeader = await login(request);
    loginHeaderTrusted = await loginTrusted(request);
    loginHeaderAdmin = await loginAdmin(request);
  });

  const url = "/api/movies"

  describe('GET /api/movies', () => {
    beforeAll(async () => {
      await knex(tables.movie).insert(data.movies);
    });

    afterAll(async () => {
      await knex(tables.movie)
        .whereIn('id', dataToDelete.movies)
        .delete();
    });

    it('it should 200 and return all movies (user)', async () => {
      const response = await request.get(url).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(4);
    });

    it('it should 200 and return all movies (trusted user)', async () => {
      const response = await request.get(url).set('Authorization', loginHeaderTrusted);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(4);
    });

    it('it should 200 and return all movies (admin user)', async () => {
      const response = await request.get(url).set('Authorization', loginHeaderAdmin);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('GET /api/movies/:id', () => {
    beforeAll(async () => {
      await knex(tables.movie).insert(data.movies[0]);
    });

    afterAll(async () => {
      await knex(tables.movie)
        .where('id', data.movies[0].id)
        .delete();
    });

    it('it should 200 and return requested movie (user)', async () => {
      const response = await request.get(`${url}/${data.movies[0].id}`).set('Authorization', loginHeader);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(data.movies[0]);
    });

    it('it should 200 and return requested movie (trusted user)', async () => {
      const response = await request.get(`${url}/${data.movies[0].id}`).set('Authorization', loginHeaderTrusted);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(data.movies[0]);
    });

    it('it should 200 and return requested movie (admin user)', async () => {
      const response = await request.get(`${url}/${data.movies[0].id}`).set('Authorization', loginHeaderAdmin);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(data.movies[0]);
    });
  });

  describe('POST /api/movies', () => {
    const moviesToDelete = [];

    const title = "new movie";
    const releaseYear = 2021;
    const synopsis = "synopsis of new movie";
    const imdbLink = "https://www.imdb.com/title/tt10872600/";

    afterAll(async () => {
      await knex(tables.movie)
        .whereIn('id', moviesToDelete)
        .delete();
    });

    it('it should 403 and not return the created movie (user)', async () => {
      const response = await request.post(url).set('Authorization', loginHeader)
      .send({
        title: title,
        releaseYear: releaseYear,
        synopsis: synopsis,
        imdbLink: imdbLink
      })

      expect(response.status).toBe(403);
      expect(response.body.id).toBeUndefined();
      expect(response.body.title).toBeUndefined();
      expect(response.body.releaseYear).toBeUndefined();
      expect(response.body.synopsis).toBeUndefined();
      expect(response.body.imdbLink).toBeUndefined();
    });

    it('it should 201 and return the created movie (trusted user)', async () => {
      const response = await request.post(url).set('Authorization', loginHeaderTrusted)
      .send({
        title: title,
        releaseYear: releaseYear,
        synopsis: synopsis,
        imdbLink: imdbLink
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe(title);
      expect(response.body.releaseYear).toBe(releaseYear);
      expect(response.body.synopsis).toBe(synopsis);
      expect(response.body.imdbLink).toBe(imdbLink);
    });

    it('it should 201 and return the created movie (admin user)', async () => {
      const response = await request.post(url).set('Authorization', loginHeaderAdmin)
      .send({
        title: title,
        releaseYear: releaseYear,
        synopsis: synopsis,
        imdbLink: imdbLink
      });

      expect(response.status).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.title).toBe(title);
      expect(response.body.releaseYear).toBe(releaseYear);
      expect(response.body.synopsis).toBe(synopsis);
      expect(response.body.imdbLink).toBe(imdbLink);
    });
  });

  describe('PUT /api/movies/:id', () => {
    const changedReleaseYear = 2018;

    beforeAll(async () => {
      await knex(tables.movie).insert(data.movies);
    });

    afterAll(async () => {
      await knex(tables.movie)
        .whereIn('id', dataToDelete.movies)
        .delete();
    });

    it('it should 403 and not return the update movie (user)', async () => {
      const response = await request.put(`${url}/${data.movies[0].id}`)
      .set('Authorization', loginHeader)
      .send({
        title: data.movies[0].title,
        releaseYear: changedReleaseYear,
        synopsis: data.movies[0].synopsis,
        imdbLink: data.movies[0].imdbLink
      });

      expect(response.status).toBe(403);
      expect(response.body.id).toBeUndefined();
      expect(response.body.title).toBeUndefined();
      expect(response.body.releaseYear).toBeUndefined();
      expect(response.body.synopsis).toBeUndefined();
      expect(response.body.imdbLink).toBeUndefined();
    });

    it('it should 200 and return the update movie (trusted user)', async () => {
      const response = await request.put(`${url}/${data.movies[0].id}`)
      .set('Authorization', loginHeaderTrusted)
      .send({
        title: data.movies[0].title,
        releaseYear: changedReleaseYear,
        synopsis: data.movies[0].synopsis,
        imdbLink: data.movies[0].imdbLink
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: data.movies[0].id,
        title: data.movies[0].title,
        releaseYear: changedReleaseYear,
        synopsis: data.movies[0].synopsis,
        imdbLink: data.movies[0].imdbLink
      });
    });

    it('it should 200 and return the update movie (admin user)', async () => {
      const response = await request.put(`${url}/${data.movies[0].id}`)
      .set('Authorization', loginHeaderAdmin)
      .send({
        title: data.movies[0].title,
        releaseYear: changedReleaseYear,
        synopsis: data.movies[0].synopsis,
        imdbLink: data.movies[0].imdbLink
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: data.movies[0].id,
        title: data.movies[0].title,
        releaseYear: changedReleaseYear,
        synopsis: data.movies[0].synopsis,
        imdbLink: data.movies[0].imdbLink
      });
    });
  });

  describe('DELETE /api/movies/:id', () => {
    beforeAll(async () => {
      await knex(tables.movie).insert(data.movies[0]);
    });

    it('it should 403 and return error message (user)', async () => {
      const response = await request.delete(`${url}/${data.movies[0].id}`)
      .set('Authorization', loginHeader);

      expect(response.status).toBe(403);
      expect(response.body).not.toEqual({});
    });

    it('it should 403 and return error message (trusted user)', async () => {
      const response = await request.delete(`${url}/${data.movies[0].id}`)
      .set('Authorization', loginHeaderTrusted);

      expect(response.status).toBe(403);
      expect(response.body).not.toEqual({});
    });

    it('it should 204 and return nothing (admin user)', async () => {
      const response = await request.delete(`${url}/${data.movies[0].id}`)
      .set('Authorization', loginHeaderAdmin);

      expect(response.status).toBe(204);
      expect(response.body).toEqual({});
    });
  });
});