/*
 * Author:	gMerrill
 * Date:	24 Feb. 2011
 * Name:	v4l2query.c
 */
 
#include <linux/videodev2.h>
#include <stdio.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>



int main (void)
{
	struct v4l2_capability test;
	int i = 0, fd = -1;
	char integer[4];
	char source[13];
	
	for(i = 0; i < 256; ++i){
		//create string for opening different "/dev/video*" devices
		strcpy(source, "/dev/video");
		sprintf(integer, "%d", i);
		strcat(source, integer);
		
		//open the device
		if((fd = open(source, O_RDONLY)) >= 0 )
		{
			//query the device's capabilites
			if(ioctl(fd, (int) (VIDIOC_QUERYCAP), &test))
				printf("ioctl failed with error == %d\n", errno);	//error message
			else
				printf("DEV_NAME: /dev/video%d \tHR_NAME: %-25s BUS_LOCATION: %s", i, test.card, test.bus_info );
			if((test.capabilities & V4L2_CAP_TUNER) == V4L2_CAP_TUNER)
				puts("\tNOTE: This is a tuner device.");
			else
				puts("");
			close(fd);
		}
		else
			exit(i);
			
		close(fd);
		
	}
	exit(-1);
}
			
