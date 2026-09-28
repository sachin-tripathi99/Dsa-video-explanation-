class Solution {
public:
    int calculateMinimumHP(vector<vector<int>>& dungeon) {
        int R = dungeon.size(), C = dungeon[0].size();
        vector<long long> need(C + 1, LLONG_MAX / 2);
        need[C - 1] = 1;                                    // after the princess: 1 health
        for (int r = R - 1; r >= 0; r--)
            for (int c = C - 1; c >= 0; c--)
                need[c] = max(1LL, min(need[c], need[c + 1]) - dungeon[r][c]);   // min(down, right)
        return need[0];
    }
};
