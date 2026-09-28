class Solution {
    int height(TreeNode* n) { return n ? 1 + max(height(n->left), height(n->right)) : 0; }
    void collect(TreeNode* n, int depth, int target, vector<int>& level) {   // a full traversal per level
        if (!n) return;
        if (depth == target) { level.push_back(n->val); return; }
        collect(n->left, depth + 1, target, level);
        collect(n->right, depth + 1, target, level);
    }
public:
    vector<vector<int>> levelOrderBottom(TreeNode* root) {
        vector<vector<int>> out;
        for (int d = height(root) - 1; d >= 0; d--) {       // deepest level first
            vector<int> level;
            collect(root, 0, d, level);
            out.push_back(level);
        }
        return out;
    }
};
