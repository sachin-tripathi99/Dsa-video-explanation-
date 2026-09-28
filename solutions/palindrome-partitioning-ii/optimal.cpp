class Solution {
public:
    int minCut(string s) {
        int n = s.size();
        vector<vector<bool>> pal(n, vector<bool>(n, false));
        for (int i = n - 1; i >= 0; i--)                    // range table
            for (int j = i; j < n; j++)
                pal[i][j] = s[i] == s[j] && (j - i < 2 || pal[i + 1][j - 1]);
        vector<int> cuts(n, 0);                             // cuts[j]: fewest cuts for s[0..j]
        for (int j = 0; j < n; j++) {
            if (pal[0][j]) continue;                        // whole prefix: 0 cuts
            cuts[j] = j;
            for (int i = 1; i <= j; i++)
                if (pal[i][j]) cuts[j] = min(cuts[j], cuts[i - 1] + 1);   // last piece s[i..j]
        }
        return cuts[n - 1];
    }
};
