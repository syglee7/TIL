#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>

int main(void) {
	int a, b;
	scanf("%d %d", &a, &b);
	printf("%d %d\n", b, a);
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