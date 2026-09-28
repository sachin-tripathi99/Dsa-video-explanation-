class Solution {
public:
    int minDistance(string word1, string word2) {
        int n = word2.size();
        vector<int> prev(n + 1), cur(n + 1);
        for (int j = 0; j <= n; j++) prev[j] = j;           // from "" : j inserts
        for (int i = 1; i <= (int)word1.size(); i++) {
            cur[0] = i;                                     // to "" : i deletes
            for (int j = 1; j <= n; j++)
                cur[j] = word1[i - 1] == word2[j - 1] ? prev[j - 1]
                        : 1 + min({prev[j - 1], prev[j], cur[j - 1]});
            swap(prev, cur);
        }
        return prev[n];
    }
};
