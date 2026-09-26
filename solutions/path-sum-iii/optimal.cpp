class Solution {
    unordered_map<long long, int> seen;
    int count = 0;
    long long target;
    void dfs(TreeNode* n, long long cur) {
        if (!n) return;
        cur += n->val;
        auto it = seen.find(cur - target);
        if (it != seen.end()) count += it->second;          // paths ending at n
        seen[cur]++;
        dfs(n->left, cur);
        dfs(n->right, cur);
        seen[cur]--;                                        // leaving this branch
    }
public:
    int pathSum(TreeNode* root, int targetSum) {
        target = targetSum;
        seen[0] = 1;                                        // empty prefix: paths from the root
        dfs(root, 0);
        return count;
    }
};
