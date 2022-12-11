import { create,insertBatch,search,remove } from '@lyrasearch/lyra';
import { stemmer } from "@lyrasearch/lyra/dist/esm/stemmer/lib/it.js";
import { persistToFile } from '@lyrasearch/plugin-data-persistence'

const toObject =(toBeParsedObject) =>{
    return JSON.parse(JSON.stringify(toBeParsedObject, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
}
const main = async()=>{
    const movieDB = create({
        schema: {
          title: 'string',
          director: 'string',
          plot: 'string',
          year: 'number',
          isFavorite: 'boolean',
        }
      });
      
      const docs = [
          {
            title: 'The prestige',
            director: 'Christopher Nolan',
            plot: 'Two friends and fellow magicians become bitter enemies after a sudden tragedy. As they devote themselves to this rivalry, they make sacrifices that bring them fame but with terrible consequences.',
            year: 2006,
            isFavorite: true
          },
          {
            title: 'Big Fish',
            director: 'Tim Burton',
            plot: 'Will Bloom returns home to care for his dying father, who had a penchant for telling unbelievable stories. After he passes away, Will tries to find out if his tales were really true.',
            year: 2004,
            isFavorite: true
          },
          {
            title: 'Harry Potter and the Philosopher\'s Stone',
            director: 'Chris Columbus',
            plot: 'Harry Potter, an eleven-year-old orphan, discovers that he is a wizard and is invited to study at Hogwarts. Even as he escapes a dreary life and enters a world of magic, he finds trouble awaiting him.',
            year: 2001,
            isFavorite: false
          }
        ];
        
        await insertBatch(movieDB, docs, { batchSize: 500 });

        const searchResult = search(movieDB, {
            term: "Harro",
            properties: ["title"],
            tolerance: 1
          });

          console.log( JSON.stringify (toObject(searchResult)))

          const filePath = persistToFile(movieDB, 'binary', './movies.msp')

}

main()