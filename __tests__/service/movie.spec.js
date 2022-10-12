const service = require("../../src/service/movie");
const repo = require("../../src/repository/movie");

describe('Unit tests, comment debugLoggers in movie service to make them work', () => {
  const movie = {
    title: "Spider-Man: No Way Home",
    releaseYear: 2021,
    synopsis: "With Spider-Man's identity now revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds start to appear, forcing Peter to discover what it truly means to be Spider-Man.",
    imdbLink: "https://www.imdb.com/title/tt10872600/"
  };

  it('should return created movie', async () => {
    repo.createMovie = jest.fn()
      .mockReturnValue({id: 1, ...movie});
    
    const result = await service.createMovie({...movie});
  
    expect(result.id).toBe(1);
    expect(result.title).toEqual(movie.title);
    expect(result.releaseYear).toEqual(movie.releaseYear);
    expect(result.synopsis).toEqual(movie.synopsis);
    expect(result.imdbLink).toEqual(movie.imdbLink);
    expect(repo.createMovie).toHaveBeenCalled();
  });

  it('Should return the movie the given id matches with', async () => {
    repo.findById = jest.fn()
      .mockReturnValue({id: 1, ...movie});

    const result = await service.getById(1);
    
    expect(result.id).toBe(1);
    expect(result.title).toEqual(movie.title);
    expect(result.releaseYear).toEqual(movie.releaseYear);
    expect(result.synopsis).toEqual(movie.synopsis);
    expect(result.imdbLink).toEqual(movie.imdbLink);
    expect(repo.findById).toHaveBeenCalled();
  })

  it('Should return a list of movies', async () => {
    repo.findAll = jest.fn()
      .mockReturnValue([{id: 1, ...movie},
        {id:2, title:"a movie", releaseYear: 2021, synopsis: "a synopsis", imdbLink: "a link"}]);

    const result = await service.getAll();

    expect(result.length).toBe(2);
    expect(repo.findAll).toHaveBeenCalled();
  })
});