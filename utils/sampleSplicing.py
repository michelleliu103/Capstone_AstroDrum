import numpy as np
import os

def findZeroCrossings(wav, stereo=False):
	"""

	take in a wav file and find all the 0 amplitude crossings. These are points
	where it is okay to split wav file into separate parts. If one splits
	the wav at a non-zero crossing there will be an audible click at the end
	of one split and beginning of the other. 

	There will not be any true 0's in the wav array, instead a 0 is when
	the array switches signs from negative to positive or visa versa

	wav - wav file to analyze
	stereo - wheth file is stereo. If true, will just use one channel to find
	zero cross and assume other channel to be close (may need to revisit this)

	returns array of indicies of zero crossings

	"""
	if stereo == False:
		zeros = np.nonzero(np.diff(wav[1]> 0))[0]
	else:
		zeros = np.nonzero(np.diff(wav[1][:,0] > 0))[0]

	return zeros

def splice(wav, ms, stereo=False):
	"""

	Split a wav file at the specified ms. This will use findZeroCrossings
	to find the closest zero crossing, before or after, the specified number
	of milliseconds to make the split

	wav - wav file to split
	ms - number of milliseconds into the wav file to make the split at the
	closest zero crossing
	stereo - whether wav is stereo or not


	returns two arrays (original single array split into two)

	"""

	#get index of possible zero crossings
	zeros = findZeroCrossings(wav,stereo)

	#convert ms to samples
	msToSamples = ms * 44.1

	#find index in zeros that is closest
	closestZero = np.argsort(abs(msToSamples - zeros))[0]

	#make splits
	split1 = wav[1][:zeros[closestZero]+1]
	split2 = wav[1][zeros[closestZero]+1:]

	return split1,split2

def randFiles(path,N=2):
	"""

	give a path choose N files randomly from that path

	path - path to files
	N - number of files to choose uniformly, randomly

	returns N files

	"""
	#get all possible files
	possible = os.listdir(path)
	#remove any that are hidden files
	wanted = [f for f in possible if f[0] != '.']
	#pick two random files
	files = np.random.choice(wanted,size=N)

	return files

def melt(wav1, wav2):
	"""

	merge wav1 and wav2 into a single wav where wav2 starts
	immediately after wav1

	wav1 - wav as array
	wav2 - wav as array

	return merged arrays

	"""

	newWave = np.concatenate((wav1,wav2))

	return newWave




