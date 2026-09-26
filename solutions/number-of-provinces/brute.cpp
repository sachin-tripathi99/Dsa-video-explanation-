class Solution {
public:
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n = isConnected.size();
        vector<int> group(n);
        iota(group.begin(), group.end(), 0);
        for (int i = 0; i < n; i++)
            for (int j = i + 1; j < n; j++)
                if (isConnected[i][j] == 1 && group[i] != group[j]) {
                    int old = group[j], now = group[i];
                    for (int k = 0; k < n; k++) if (group[k] == old) group[k] = now;   // O(n) relabel
                }
        return set<int>(group.begin(), group.end()).size();
    }
};
