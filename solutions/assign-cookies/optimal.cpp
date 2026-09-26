class Solution {
public:
    int findContentChildren(vector<int>& g, vector<int>& s) {
        sort(g.begin(), g.end());
        sort(s.begin(), s.end());
        size_t i = 0;                                       // least greedy waiting child
        for (size_t j = 0; j < s.size() && i < g.size(); j++)
            if (s[j] >= g[i]) i++;                          // cookie j satisfies child i
        return i;
    }
};
