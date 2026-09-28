class Solution {
    void dfs(TreeNode* n, int depth, vector<vector<int>>& out) {
        if (!n) return;
        if (depth == (int)out.size()) out.push_back({});    // first node at this depth
        out[depth].push_back(n->val);
        dfs(n->left, depth + 1, out);
        dfs(n->right, depth + 1, out);
    }
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        vector<vector<int>> out;
        dfs(root, 0, out);
        return out;
    }
};
