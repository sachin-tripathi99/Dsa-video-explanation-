class Solution {
    int parent[26];

    int find(int x) {
        while (parent[x] != x) {
            parent[x] = parent[parent[x]];
            x = parent[x];
        }
        return x;
    }
public:
    bool equationsPossible(vector<string>& equations) {
        for (int i = 0; i < 26; i++) parent[i] = i;
        for (auto& e : equations)                         // pass 1: build the groups
            if (e[1] == '=') parent[find(e[0] - 'a')] = find(e[3] - 'a');
        for (auto& e : equations)                         // pass 2: check the inequalities
            if (e[1] == '!' && find(e[0] - 'a') == find(e[3] - 'a')) return false;
        return true;
    }
};
