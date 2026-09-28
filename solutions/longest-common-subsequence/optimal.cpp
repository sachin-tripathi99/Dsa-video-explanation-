class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        int n = text2.size();
        vector<int> prev(n + 1, 0), cur(n + 1, 0);          // two rows
        for (char a : text1) {
            for (int j = 1; j <= n; j++)
                cur[j] = a == text2[j - 1] ? prev[j - 1] + 1 : max(prev[j], cur[j - 1]);
            swap(prev, cur);
        }
        return prev[n];
    }
};
