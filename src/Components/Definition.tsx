import { ReactComponent as SourceIcon } from '../assets/images/icon-new-window.svg';
import { ReactComponent as PlayButton } from '../assets/images/icon-play.svg';
import Loader from '../Util/Loader';
import Error from './Error';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

interface Props {
  data:
    | {
        word: string;
        meanings: {
          partOfSpeech: string;
          definitions: { definition: string; example?: string }[];
          synonyms?: string[];
          antonyms?: string[];
        }[];
        phonetic: string;
        phonetics: { audio: string }[];
        sourceUrls: string;
      }[]
    | null;
  loading: boolean;
  error: {
    title: string;
    message: string;
    resolution: string;
  } | null;
}

const Definition = ({ data, loading, error }: Props) => {
  const [hasAudio, setHasAudio] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const audioUrl = data?.[0].phonetics
    .map((audio) => audio.audio)
    .filter((audio) => audio !== '')
    .slice(0, 1)
    .join(', ');

  useEffect(() => {
    if (audioUrl) {
      setHasAudio(true);
    } else {
      setHasAudio(false);
    }
  }, [data]);

  const playAudio = () => {
    const audio = new Audio(audioUrl);
    audio.play();
  };

  return (
    <section>
      {loading && <Loader />}
      {error !== null && <Error error={error} />}
      {data !== null && !loading && !error && (
        <div className="mx-auto mt-6 max-w-3xl md:mt-10">
          <div className="mb-8 flex items-center justify-between md:mb-10">
            <div className="flex flex-col">
              <h1 className="text-[2rem] font-bold md:text-[4rem]">
                {data[0].word}
              </h1>
              <p className="font-inter text-lg text-custom-A445ED md:text-2xl">
                {data[0].phonetic}
              </p>
            </div>
            {/* Audio button */}
            <button
              onClick={() => {
                playAudio();
              }}
              aria-label="Play audio pronunciation of word"
            >
              <PlayButton
                className={`max-w-[3rem] cursor-pointer opacity-75 transition-opacity duration-300 hover:opacity-100 md:max-w-full ${
                  hasAudio ? '' : 'hidden'
                }`}
              />
            </button>
          </div>
          {data.map((word, index) => (
            <div key={index}>
              {word.meanings.map((meaning, index) => (
                // Part of speech
                <div key={index}>
                  <div className="flex items-center gap-8">
                    <h2 className="text-lg font-bold md:text-2xl">
                      {meaning.partOfSpeech}
                    </h2>
                    <div className="h-[1px] w-full bg-custom-E9E9E9 transition-colors duration-300 dark:bg-custom-3A3A3A"></div>
                  </div>

                  <div className="my-8 md:my-10">
                    <p className="mb-4 text-custom-838383 md:mb-6 md:text-xl">
                      Meaning
                    </p>
                    {/* Definition */}
                    <ul className="mb-6 flex flex-col gap-3 md:mb-10">
                      {meaning.definitions.map((definition, index) => (
                        <li
                          key={index}
                          className="ml-[1.125rem] list-disc text-[0.938rem] marker:text-custom-A445ED md:text-lg"
                        >
                          {definition.definition}
                          {/* Example */}
                          {definition.example && (
                            <p className="my-3 text-custom-838383">
                              "{definition.example}"
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                    {/* Synonyms */}
                    {meaning.synonyms && meaning.synonyms.length > 0 && (
                      <div className="mb-8 flex items-center md:mb-10 md:text-xl">
                        <p className="mr-6 text-custom-838383 ">Synonyms</p>
                        <ul>
                          {meaning.synonyms.map((synonym, index) => (
                            <li
                              key={index}
                              className="ml-3 inline-block cursor-pointer font-bold text-custom-A445ED hover:underline [&:not(:last-child)]:after:content-[',']"
                              onClick={() => {
                                setSearchParams({ word: synonym });
                              }}
                            >
                              {synonym}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {/* Antonyms */}
                    {meaning.antonyms && meaning.antonyms.length > 0 && (
                      <div className="mb-8 flex items-center md:mb-10 md:text-xl">
                        <p className="mr-6 text-custom-838383">Antonyms</p>
                        <ul>
                          {meaning.antonyms.map((antonym, index) => (
                            <li
                              key={index}
                              className="ml-3 inline-block cursor-pointer font-bold text-custom-A445ED hover:underline [&:not(:last-child)]:after:content-[',']"
                              onClick={() => {
                                setSearchParams({ word: antonym });
                              }}
                            >
                              {antonym}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
          {/* Source */}
          <div className="flex flex-col gap-1 border-t-[1px] border-custom-E9E9E9 pt-6 pb-20 text-sm transition-[border-color] duration-300 dark:border-custom-3A3A3A md:flex-row md:items-center md:gap-6">
            <p className="text-custom-838383 underline underline-offset-2">
              Source
            </p>
            <a
              target={'_blank'}
              rel="noopener noreferrer"
              href={data[0].sourceUrls}
              className="flex items-center gap-2 break-words underline underline-offset-2"
            >
              {data[0].sourceUrls}
              <SourceIcon aria-label="Link to source" />
            </a>
          </div>
        </div>
      )}
    </section>
  );
};

export default Definition;
