/*
Author:		Derrick Streng
Date:		20 July 2011
license:	N/A

Notes:		Pass any commandline arg to this program and it will
			run recursively, otherwise the mixed threaded/recursive
			form will run.
*/

#include <stdio.h>
#include <pthread.h>
#include <stdlib.h>

#define SIZE 3 * 1
#define COLORS 128

pthread_mutex_t printLock = PTHREAD_MUTEX_INITIALIZER;

//recursively create strings representing images
void create(int n, unsigned char pixel[]){
	int i,j;
	if(n == (SIZE) - 1){
		pthread_mutex_lock(&printLock);
		for(i = 0; i < COLORS; i++){
			for(j = 0; j < (SIZE) - 1; ++j){
				printf("%d,", pixel[j]);
			}
			printf("%d\n", i);
		}
		pthread_mutex_unlock(&printLock);
	}
	else{
		for(i = 0; i < COLORS; ++i){
			pixel[n] = i;
			create(n + 1, pixel);
		}
	}	
}

//A new thread for each possible initial Value in the image.
void *threader(void *data){
	unsigned char * pixel = (unsigned char *) data;
	create(1, pixel);
	pthread_exit(NULL);
}

int main (int argc, char *argv[]){
	pthread_t threads[COLORS];
	unsigned char pixel[COLORS][SIZE - 1];
	int i;
	//recursively create All possible images
	if(argc > 1){
		create(0, &pixel[0][0]);
		fprintf(stderr, "\nRecursive.\n");
		pthread_mutex_destroy(&printLock);
		exit(0);
	}
	
	//create a new thread for each possible initial value of first pixel
	//and work out recursively from there for each thread.
	for(i = 0; i < COLORS; ++i){
		pixel[i][0] = i;
		while(pthread_create(&threads[i], NULL, threader, &pixel[i][0]));
		printf("\nThread: %d created\n", (int) threads[i]);
	}
	
	//finish all threads
	for(i = 0; i < COLORS; i++){
		if(pthread_join(threads[i], NULL))
			printf("\nError Joining thread %d.\n", (int) threads[i]);
	}
	fprintf(stderr,"\nThreaded.\n");
	
	//clean up
	pthread_mutex_destroy(&printLock);
	pthread_exit(NULL);
}
