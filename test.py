#coding=utf-8
def test(num):
	if num <= 1:
		return 1
	else:
		num = int(num) * test(int(num)-1)


test(3)
