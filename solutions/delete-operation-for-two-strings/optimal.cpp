class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<int> prev(n + 1, 0), cur(n + 1, 0);          // LCS rows
        for (char a : word1) {
            for (int j = 1; j <= n; j++)
                cur[j] = a == word2[j - 1] ? prev[j - 1] + 1 : max(prev[j], cur[j - 1]);
            swap(prev, cur);
        }
        return m + n - 2 * prev[n];                         // delete everything outside the LCS
    }
};
