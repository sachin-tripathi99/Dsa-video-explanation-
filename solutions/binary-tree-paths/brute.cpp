class Solution {
    vector<string> out;
    void dfs(TreeNode* node, string s) {
        if (!node) return;
        s = s.empty() ? to_string(node->val) : s + "->" + to_string(node->val);   // new string each call
        if (!node->left && !node->right) { out.push_back(s); return; }
        dfs(node->left, s);
        dfs(node->right, s);
    }
public:
    vector<string> binaryTreePaths(TreeNode* root) {
        dfs(root, "");
        return out;
    }
};
