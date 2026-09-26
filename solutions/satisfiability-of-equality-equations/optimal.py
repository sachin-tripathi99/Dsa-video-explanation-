class Solution:
    def equationsPossible(self, equations: List[str]) -> bool:
        parent = list(range(26))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for e in equations:                     # pass 1: build the groups
            if e[1] == "=":
                parent[find(ord(e[0]) - 97)] = find(ord(e[3]) - 97)
        for e in equations:                     # pass 2: check the inequalities
            if e[1] == "!" and find(ord(e[0]) - 97) == find(ord(e[3]) - 97):
                return False
        return True
