﻿<%@ Page Title="" Language="C#" MasterPageFile="~/Areas/aspx/Views/Shared/Web.Master" Inherits="System.Web.Mvc.ViewPage<dynamic>" %>
<%@ Import Namespace="Kendo.Mvc.Examples.Models" %>
<%@ Import Namespace="Kendo.Mvc.UI.Fluent" %>
<asp:Content ContentPlaceHolderID="MainContent" runat="server">

<div class="demo-section k-content">
    <h4>Inline data (default settings)</h4>
    <%=
        Html.Kendo().TreeView()
            .Name("treeview-left")
            .BindTo((IEnumerable<TreeViewItemModel>)ViewBag.inlineDefault)
    %>
</div>

<div class="demo-section k-content">
    <h4>Inline data</h4>
    <%=
        Html.Kendo().TreeView()
            .Name("treeview-right")
            .BindTo((IEnumerable<CategoryItem>)ViewBag.inline, (NavigationBindingFactory<TreeViewItem> mappings) =>
            {
                mappings.For<CategoryItem>(binding => binding.ItemDataBound((item, category) =>
                    {
                        item.Text = category.CategoryName;
                    })
                    .Children(category => category.SubCategories));
                
                mappings.For<SubCategoryItem>(binding => binding.ItemDataBound((item, subCategory) =>
                {
                    item.Text = subCategory.SubCategoryName;
                }));
            })
    %>
</div>

 <style>
    #example {
        text-align: center;
    }

    .demo-section {
        display: inline-block;
        vertical-align: top;
        text-align: left;
        margin: 0 2em;
    }
</style>

</asp:Content>