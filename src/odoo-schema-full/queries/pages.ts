import { gql } from "graphql-request";

// استعلام للحصول على بيانات صفحة About
export const GET_ABOUT_PAGE = gql`
  query GetAboutPage($lang: String = "ar") {
    aboutPage(lang: $lang) {
      id
      title
      description
      content
      storeInfo {
        name
        address
        phone
        email
        workingHours {
          weekdays
          weekdaysHours
          weekend
          weekendHours
        }
        location {
          latitude
          longitude
        }
      }
      images {
        url
        alt
        caption
      }
      seo {
        title
        description
        keywords
      }
    }
  }
`;

// استعلام للحصول على بيانات صفحة Contact
export const GET_CONTACT_PAGE = gql`
  query GetContactPage($lang: String = "ar") {
    contactPage(lang: $lang) {
      id
      title
      description
      content
      contactInfo {
        address
        phone
        email
        whatsapp
        socialMedia {
          facebook
          twitter
          instagram
          linkedin
        }
      }
      contactForm {
        fields {
          name
          type
          required
          placeholder
          options
        }
      }
      officeHours {
        weekdays
        weekdaysHours
        weekend
        weekendHours
      }
      seo {
        title
        description
        keywords
      }
    }
  }
`;

// استعلام للحصول على بيانات صفحة Jobs
export const GET_JOBS_PAGE = gql`
  query GetJobsPage($lang: String = "ar", $limit: Int = 10, $offset: Int = 0) {
    jobsPage(lang: $lang) {
      id
      title
      description
      content
      seo {
        title
        description
        keywords
      }
    }
    jobs(lang: $lang, limit: $limit, offset: $offset) {
      id
      title
      description
      department
      location
      type
      requirements
      responsibilities
      benefits
      salaryRange
      applicationDeadline
      isActive
      createdAt
      updatedAt
      applicationUrl
      contactEmail
    }
  }
`;

// استعلام للحصول على بيانات صفحة Privacy Policy
export const GET_PRIVACY_PAGE = gql`
  query GetPrivacyPage($lang: String = "ar") {
    privacyPage(lang: $lang) {
      id
      title
      description
      content
      sections {
        id
        title
        content
        order
      }
      lastUpdated
      effectiveDate
      contactInfo {
        email
        phone
        address
      }
      seo {
        title
        description
        keywords
      }
    }
  }
`;

// استعلام للحصول على بيانات صفحة Terms & Conditions
export const GET_TERMS_PAGE = gql`
  query GetTermsPage($lang: String = "ar") {
    termsPage(lang: $lang) {
      id
      title
      description
      content
      sections {
        id
        title
        content
        order
        subsections {
          id
          title
          content
          order
        }
      }
      lastUpdated
      effectiveDate
      governingLaw
      contactInfo {
        email
        phone
        address
      }
      seo {
        title
        description
        keywords
      }
    }
  }
`;

// استعلام للحصول على بيانات صفحة Blog
export const GET_BLOG_PAGE = gql`
  query GetBlogPage($lang: String = "ar", $limit: Int = 10, $offset: Int = 0, $categoryId: ID) {
    blogPage(lang: $lang) {
      id
      title
      description
      content
      seo {
        title
        description
        keywords
      }
    }
    blogPosts(lang: $lang, limit: $limit, offset: $offset, categoryId: $categoryId) {
      id
      title
      excerpt
      content
      slug
      featuredImage {
        url
        alt
        caption
      }
      author {
        id
        name
        avatar
        bio
      }
      category {
        id
        name
        slug
        color
      }
      tags {
        id
        name
        slug
      }
      publishedAt
      updatedAt
      readingTime
      isPublished
      seo {
        title
        description
        keywords
      }
    }
    blogCategories(lang: $lang) {
      id
      name
      slug
      description
      color
      postCount
    }
  }
`;

// استعلام للحصول على منشور مدونة واحد
export const GET_BLOG_POST = gql`
  query GetBlogPost($slug: String!, $lang: String = "ar") {
    blogPost(slug: $slug, lang: $lang) {
      id
      title
      excerpt
      content
      slug
      featuredImage {
        url
        alt
        caption
      }
      gallery {
        url
        alt
        caption
      }
      author {
        id
        name
        avatar
        bio
        socialMedia {
          twitter
          linkedin
          instagram
        }
      }
      category {
        id
        name
        slug
        color
      }
      tags {
        id
        name
        slug
      }
      publishedAt
      updatedAt
      readingTime
      isPublished
      views
      likes
      comments {
        id
        content
        author {
          name
          email
          avatar
        }
        createdAt
        isApproved
        replies {
          id
          content
          author {
            name
            email
            avatar
          }
          createdAt
          isApproved
        }
      }
      relatedPosts {
        id
        title
        excerpt
        slug
        featuredImage {
          url
          alt
        }
        publishedAt
        readingTime
      }
      seo {
        title
        description
        keywords
        ogImage
      }
    }
  }
`;

// استعلام للحصول على جميع الصفحات الثابتة
export const GET_STATIC_PAGES = gql`
  query GetStaticPages($lang: String = "ar") {
    staticPages(lang: $lang) {
      id
      title
      slug
      description
      content
      type
      isPublished
      order
      parentId
      children {
        id
        title
        slug
        order
      }
      seo {
        title
        description
        keywords
      }
      createdAt
      updatedAt
    }
  }
`;

// استعلام للحصول على صفحة ثابتة واحدة
export const GET_STATIC_PAGE = gql`
  query GetStaticPage($slug: String!, $lang: String = "ar") {
    staticPage(slug: $slug, lang: $lang) {
      id
      title
      slug
      description
      content
      type
      isPublished
      order
      parentId
      parent {
        id
        title
        slug
      }
      children {
        id
        title
        slug
        order
      }
      breadcrumbs {
        id
        title
        slug
      }
      seo {
        title
        description
        keywords
        ogImage
      }
      createdAt
      updatedAt
    }
  }
`;

// استعلام للحصول على قائمة التنقل
export const GET_NAVIGATION_MENU = gql`
  query GetNavigationMenu($location: String = "main", $lang: String = "ar") {
    navigationMenu(location: $location, lang: $lang) {
      id
      name
      location
      items {
        id
        title
        url
        type
        target
        order
        parentId
        children {
          id
          title
          url
          type
          target
          order
        }
        icon
        description
        isActive
      }
    }
  }
`;

// استعلام للحصول على إعدادات الموقع
export const GET_SITE_SETTINGS = gql`
  query GetSiteSettings($lang: String = "ar") {
    siteSettings(lang: $lang) {
      id
      siteName
      siteDescription
      siteUrl
      logo {
        url
        alt
      }
      favicon {
        url
      }
      contactInfo {
        email
        phone
        whatsapp
        address
        socialMedia {
          facebook
          twitter
          instagram
          linkedin
          youtube
          tiktok
        }
      }
      businessHours {
        weekdays
        weekdaysHours
        weekend
        weekendHours
        timezone
      }
      seo {
        defaultTitle
        defaultDescription
        defaultKeywords
        ogImage
        twitterCard
      }
      analytics {
        googleAnalyticsId
        facebookPixelId
        tiktokPixelId
      }
      features {
        enableBlog
        enableJobs
        enableNewsletter
        enableComments
        enableRatings
      }
    }
  }
`;

// استعلام للحصول على بيانات صفحة سياسة الإرجاع
export const GET_REFUND_PAGE = gql`
  query GetRefundPage($lang: String = "ar") {
    refundPage(lang: $lang) {
      id
      title
      description
      content
      sections {
        id
        title
        content
        order
        items {
          id
          title
          description
          order
        }
      }
      returnPeriod
      processingTime
      contactInfo {
        email
        phone
        address
        workingHours
      }
      lastUpdated
      effectiveDate
      seo {
        title
        description
        keywords
      }
    }
  }
`;

// استعلام للبحث في المحتوى
export const SEARCH_CONTENT = gql`
  query SearchContent($query: String!, $type: String, $lang: String = "ar", $limit: Int = 20) {
    searchContent(query: $query, type: $type, lang: $lang, limit: $limit) {
      results {
        id
        title
        excerpt
        url
        type
        image {
          url
          alt
        }
        publishedAt
        relevanceScore
      }
      totalCount
      suggestions
      filters {
        type
        count
      }
    }
  }
`;