a, b = 15, 15
n = max(a,b)
k = 5
# li = [[i * n + j for j in range(n)] for i in range(n)]
li = [[-1 for j in range(n)] for i in range(n)]
for i in range(a):
    for j in range(b):
        li[i][j] = i * b + j

# print(li)
def f(li):
    for x in li:
        if not 0 <= x < a*b: return False
    return True

for i in range(n-k+1):
    for j in range(n):
        tmp = []
        for l in range(i, i+k):
            tmp.append(li[j][l])
        if f(tmp): print(f'{tmp},')

for i in range(n-k+1):
    for j in range(n):
        tmp = []
        for l in range(i, i+k):
            tmp.append(li[l][j])
        if f(tmp): print(f'{tmp},')

for i in range(n-k+1):
    for j in range(n):
        tmp = []
        for l in range(i, i+k):
            try: tmp.append(li[j+l-i][l])
            except: pass
        if len(tmp) == k and f(tmp): print(f'{tmp},')

for i in range(n-k+1):
    for j in range(n):
        tmp = []
        for l in range(i, i+k):
            try:
                if 0<=j-l+i<n: tmp.append(li[l][j-l+i])
            except: pass
        if len(tmp) == k and f(tmp): print(f'{tmp},')