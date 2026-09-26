class Solution {
public:
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n = isConnected.size(), provinces = 0;
        vector<bool> seen(n, false);
        for (int c = 0; c < n; c++) {
            if (seen[c]) continue;
            provinces++;
            vector<int> stack = {c};
            seen[c] = true;
            while (!stack.empty()) {
                int x = stack.back(); stack.pop_back();
                for (int j = 0; j < n; j++)
                    if (isConnected[x][j] == 1 && !seen[j]) { seen[j] = true; stack.push_back(j); }
            }
        }
        return provinces;
    }
};
