#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main(void) {
	int a, b, c;
	scanf("%1d%1d%1d", &a, &b, &c);
	printf("%d %d %d\n", a, b, c);
	system("pause");
	return 0;
}

/*
int ����� 4byte
long long ���ڰ� �� �������� ǥ���� �� ��� 8byte
double �Ϲ����� �Ǽ� 8byte
string ���ڿ��� ǥ���� �� ���
bool ��/���� 1bit
char �� ���ڸ� ǥ���� �� ��� 1byte
*/