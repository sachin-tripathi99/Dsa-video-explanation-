class Solution {
    void dfs(TreeNode* node, vector<int>& out) {
        if (!node) return;
        out.push_back(node->val);                           // node
        dfs(node->left, out);                               // left
        dfs(node->right, out);                              // right
    }
public:
    vector<int> preorderTraversal(TreeNode* root) {
        vector<int> out;
        dfs(root, out);
        return out;
    }
};
