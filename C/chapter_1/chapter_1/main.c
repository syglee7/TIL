#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main(void) {
	double a;
	scanf("%lf", &a);
	printf("%.2f\n", a);
	system("pause");
	return 0;
}

/*
int 억단위 4byte
long long 숫자가 긴 정수형을 표현할 때 사용 8byte
double 일반적인 실수 8byte
string 문자열을 표현할 때 사용
bool 참/거짓 1bit
char 한 문자를 표현할 때 사용 1byte
*/